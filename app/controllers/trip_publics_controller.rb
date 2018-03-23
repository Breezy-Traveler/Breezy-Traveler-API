class TripPublicsController < ApplicationController
  before_action :set_trip_public, only: [:show, :update, :destroy]

  # GET /trip_publics
  def index
    @trip_publics = TripPublic.all

    render json: @trip_publics
  end

  # GET /trip_publics/1
  def show
    render json: @trip_public
  end

  # POST /trip_publics
  def create
    @trip_public = TripPublic.new(trip_public_params)

    # Add the current logged in user as the creator of the trip
    @trip_public.user = current_user

    if @trip_public.save
      render json: @trip_public, status: :created, location: @trip_public
    else
      render json: @trip_public.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /trip_publics/1
  def update
    if @trip_public.update(trip_public_params)
      render json: @trip_public
    else
      render json: @trip_public.errors, status: :unprocessable_entity
    end
  end

  # DELETE /trip_publics/1
  def destroy
    @trip_public.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_trip_public
      @trip_public = TripPublic.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def trip_public_params
      params.require(:trip_public).permit(:place, :start_date, :end_date, :user_id, :trip_id)
    end
end
