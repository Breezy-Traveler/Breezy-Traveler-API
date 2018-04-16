class PublishedTripsController < ApplicationController

  def index
    if published_params[:fetch_all]
      @published_trips = Trip.where(is_public: true)
    else
      @published_trips = Trip.where(is_public: true).take(10)
    end

    if @published_trips
      render json: @published_trips
    else
      render json: @published_trips.errors, status: :unprocessable_entity
    end
  end

  private
    def published_params
      params.permit(:fetch_all)
    end
end
