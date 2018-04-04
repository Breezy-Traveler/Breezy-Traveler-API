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

    # did authenticate?
    if @user
      @user.generate_token

      # can save ok?
      if @user.save!
        render json: @user, status: :created
      else
        render json: @user.errors, status: :unprocessable_entity
      end
    else
      render_unauthorized("Invalid Login")
    end

  end

  private
    def authenticate_user
      auth_params = params.permit(:username, :password)

      user = User.authenticate(auth_params[:username], auth_params[:password])
      if user
        user.password = auth_params[:password]

        user
      else
        nil
      end
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.permit(:name, :email, :username, :password)
    end
end
