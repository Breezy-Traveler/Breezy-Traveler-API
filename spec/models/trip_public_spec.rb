require 'rails_helper'

RSpec.describe TripPublic, type: :model do

  before(:each) do
    @user = User.new(name: "Phyllis", email: "phyllis@test.com", username: "phyllis", password: "long_enough")
    @trip = Trip.new(place: "SF", start_date: DateTime.now.utc, end_date: DateTime.now.utc, trip_public: nil, user: @user)
  end

  describe "Validations" do

    it "is valid with all attributes" do
      trip_public = TripPublic.new(
          place: "SF",
          start_date: DateTime.now.utc,
          end_date: DateTime.now.utc,
          trip: @trip,
          user: @user
      )

      @trip.trip_public = trip_public

      expect(trip_public).to be_valid
    end

    it "is invalid without a place" do
      bad_trip_public = TripPublic.new(
          place: nil,
          start_date: DateTime.now.utc,
          end_date: DateTime.now.utc,
          trip: @trip,
          user: @user
      )
      expect(bad_trip_public).to_not be_valid
    end

    it "is valid without a start_date" do
      trip_public = TripPublic.new(
          place: "SF",
          start_date: nil,
          end_date: DateTime.now.utc,
          trip: @trip,
          user: @user
      )
      expect(trip_public).to be_valid
    end

    it "is valid without a end_date" do
      trip_public = TripPublic.new(
          place: "SF",
          start_date: DateTime.now.utc,
          end_date: nil,
          trip: @trip,
          user: @user
      )
      expect(trip_public).to be_valid
    end

    it "is invalid without trip" do
      bad_trip_public = TripPublic.new(
          place: "SF",
          start_date: DateTime.now.utc,
          end_date: DateTime.now.utc,
          trip: nil,
          user: @user
      )

      expect(bad_trip_public).to_not be_valid
    end

    it "is invalid without a user" do
      bad_trip_public = TripPublic.new(
          place: "SF",
          start_date: DateTime.now.utc,
          end_date: nil,
          trip: @trip,
          user: nil
      )
      expect(bad_trip_public).to_not be_valid
    end
  end

  describe "Associations" do
    it "should belong to a user" do
      assoc = TripPublic.reflect_on_association(:user)
      expect(assoc.macro).to eq :belongs_to
    end
    it "should belong to a trip" do
      assoc = TripPublic.reflect_on_association(:trip)
      expect(assoc.macro).to eq :belongs_to
    end
  end
end
