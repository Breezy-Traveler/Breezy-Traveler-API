class HotelsController < ApplicationController
  before_action :set_hotel, only: [:show, :update, :destroy]

  # GET /hotels
  def index
    @hotels = Hotel.all

    render json: @hotels
  end

  # GET /hotels/1
  def show
    render json: @hotel
  end

  # POST /hotels
  def create
    @hotel = Hotel.new(hotel_params)

    # TODO: add to trip defined in the url
    @hotel.trip = @trip

    # Add the current logged in user as the creator of the trip
    @hotel.user = current_user

    if @hotel.save
      render json: @hotel, status: :created # , location: @hotel
    else
      render json: @hotel.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /hotels/1
  def update
    if @hotel.update(hotel_params)
      render json: @hotel
    else
      render json: @hotel.errors, status: :unprocessable_entity
    end
  end

  # DELETE /hotels/1
  def destroy
    @hotel.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_hotel
      @hotel = Hotel.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def hotel_params
      @trip = Trip.find(params[:trip_id])

      # FIXME: assign the trip using params? or the url's :trip_id
      params.permit(:title, :address, :ratings, :notes, :is_visited)
    end
end
