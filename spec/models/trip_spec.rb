require 'rails_helper'

RSpec.describe Trip, type: :model do

  before(:each) do
    @user = User.new(name: "Phyllis", email: "phyllis@test.com", username: "phyllis", password: "long_enough")
    @cover_image = 'https://media.gettyimages.com/photos/oberbaumbruecke-winter-berlin-with-frozen-spree-river-picture-id861705364?b=1\u0026k=6\u0026m=861705364\u0026s=170x170\u0026h=Z7N6H6OMGiiO_v-6PNF4vvup2zUvuD9hv0SpsQ4vcYY='
  end

  describe "Validations" do

		it "is valid with valid attributes" do
			trip = Trip.new(
					place: "SF",
					start_date: DateTime.now.utc,
					end_date: DateTime.now.utc,
					is_public: true,
          cover_image_url: @cover_image,
					notes: "my notes",
					user: @user
			)
			expect(trip).to be_valid
		end

		it "is valid with valid attributes" do
			trip = Trip.new(
					place: "SF",
					start_date: DateTime.now.utc,
					end_date: DateTime.now.utc,
					is_public: false,
					cover_image_url: @cover_image,
					notes: "my notes",
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
				cover_image_url: @cover_image,
				notes: "my notes",
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
				cover_image_url: @cover_image,
				notes: "my notes",
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
					cover_image_url: @cover_image,
					notes: "my notes",
					user: @user
			)
			expect(trip).to be_valid
		end

		it "is valid without a cover_image_url" do
			trip = Trip.new(
					place: "SF",
					start_date: DateTime.now.utc,
					end_date: nil,
					is_public: true,
					cover_image_url: nil,
					notes: "my notes",
					user: @user
			)
			expect(trip).to be_valid
		end

		it "is valid without notes" do
			trip = Trip.new(
					place: "SF",
					start_date: DateTime.now.utc,
					end_date: DateTime.now.utc,
					is_public: true,
					cover_image_url: @cover_image,
					notes: nil,
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
				cover_image_url: @cover_image,
				notes: "my notes",
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
