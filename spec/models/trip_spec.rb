require 'rails_helper'

RSpec.describe Trip, type: :model do
	subject {
  	User.new(name: "Phyllis", email: "phyllis@test.com", username: "phyllis")
	}

  describe "Validations" do
    it "is valid with valid attributes" do
      trip = Trip.new(
        place: "SF",
        start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: true,
        user: subject
      )
      expect(trip).to be_valid
    end

		# FIXME: Get Eliel's help with falsey values test passing
		it "is valid with valid false is_public" do
      trip = Trip.new(
        place: "SF",
        start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: false,
        user: subject
      )
      expect(trip).to be_valid
    end

		it "is invalid without a place" do
			bad_trip = Trip.new(
				place: nil,
				start_date: DateTime.now.utc,
				end_date: DateTime.now.utc,
				is_public: true,
				user: subject
			)
			expect(bad_trip).to_not be_valid
		end

		it "is valid without a start_date" do
      trip = Trip.new(
        place: "SF",
        start_date: nil,
				end_date: DateTime.now.utc,
				is_public: true,
        user: subject
      )
      expect(trip).to be_valid
    end

		it "is valid without a end_date" do
			trip = Trip.new(
				place: "SF",
				start_date: DateTime.now.utc,
				end_date: nil,
				is_public: true,
				user: subject
			)
			expect(trip).to be_valid
		end

    # it "is invalid without a start_date" do
    #   bad_trip = Trip.new(
    #     place: "SF",
    #     start_date: nil,
		# 		end_date: DateTime.now.utc,
		# 		is_public: False,
    #     user: before
    #   )
    #   expect(bad_memo).to_not be_valid
    # end
		#
		# it "is invalid without a end_date" do
    #   bad_trip = Trip.new(
    #     place: "SF",
    #     start_date: nil,
		# 		end_date: DateTime.now.utc,
		# 		is_public: False,
    #     user: before
    #   )
    #   expect(bad_memo).to_not be_valid
    # end

    it "is invalid without a user" do
			bad_trip = Trip.new(
				place: "SF",
				start_date: DateTime.now.utc,
				end_date: nil,
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
