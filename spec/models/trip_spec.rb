require 'rails_helper'

RSpec.describe Trip, type: :model do

  before(:each) do
    @user = User.new(name: "Phyllis", email: "phyllis@test.com", username: "phyllis", password: "long_enough")
  end

  describe "Validations" do

    it "is valid with valid attributes" do
      trip = Trip.new(
        place: "SF",
        start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: true,
        user: @user
      )
      expect(trip).to be_valid
    end

		it "is invalid without a place" do
			bad_trip = Trip.new(
				place: nil,
				start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: true,
				user: @user
			)
      expect(bad_trip).to_not be_valid
		end

		it "is valid without a start_date" do
      trip = Trip.new(
        place: "SF",
        start_date: nil,
				end_date: DateTime.now.utc,
				is_public: true,
        user: @user
      )
      expect(trip).to be_valid
    end

		it "is valid without a end_date" do
			trip = Trip.new(
				place: "SF",
				start_date: DateTime.now.utc,
				end_date: nil,
				is_public: true,
				user: @user
			)
      expect(trip).to be_valid
		end

    it "is invalid without a user" do
			bad_trip = Trip.new(
				place: "SF",
				start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: true,
				user: nil
			)
      expect(bad_trip).to_not be_valid
    end
  end

  describe "Associations" do
		it "should belong to a user" do
			assoc = Trip.reflect_on_association(:user)
			expect(assoc.macro).to eq :belongs_to
		end
  end
end
