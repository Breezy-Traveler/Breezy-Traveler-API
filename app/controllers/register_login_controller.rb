class RegisterLoginController < ApplicationController
  skip_before_action :require_login, only: [:register, :login], raise: false

  # POST /register
  def register
    @user = User.new(user_params)

    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def login
    @user = authenticate_user

    if @user
      @user.generate_token

      if @user.save!

        new_user = {:id => @user.id, :name => @user.name, :username => @user.username, :token => @user.token}

        render json: new_user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else
      render_unauthorized("User: Not authorized")
    end

  end

  private

    def authenticate_user
      auth_params = params.permit(:email, :password)

      user = User.authenticate(auth_params[:email], auth_params[:password])
      user.password = auth_params[:password]

      user
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.permit(:name, :email, :username, :password)
    end
end
