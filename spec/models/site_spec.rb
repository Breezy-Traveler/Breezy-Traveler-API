require 'rails_helper'

RSpec.describe Site, type: :model do
  before(:each) do
    @user = User.new(name: "Phyllis", email: "phyllis@test.com", username: "phyllis", password: "long_enough")
    @trip = Trip.new(place: "SF", start_date: DateTime.now.utc, end_date: DateTime.now.utc, is_public: false, notes: "", user: @user)
  end

  describe "Validations" do
    it "should save with valid attributes" do
      site = Site.new(
          title: "Days Inn",
          notes: "I liked the tv that was in my room",
          address: "1234 ABC Rd",
          ratings: 4,
          is_visited: true,
          trip: @trip
      )
      expect(site).to be_valid
    end
    it "should save with valid attributes" do
      site = Site.new(
          title: "Days Inn",
          notes: nil,
          address: "1234 ABC Rd",
          ratings: 4,
          is_visited: true,
          trip: @trip
      )
      expect(site).to be_valid
    end
    it "should save with valid attributes" do
      site = Site.new(
          title: "Days Inn",
          notes: "I liked the tv that was in my room",
          address: nil,
          ratings: 4,
          is_visited: true,
          trip: @trip
      )
      expect(site).to be_valid
    end
    it "should save with valid attributes" do
      site = Site.new(
          title: "Days Inn",
          notes: "I liked the tv that was in my room",
          address: "1234 ABC Rd",
          ratings: nil,
          is_visited: true,
          trip: @trip
      )
      expect(site).to be_valid
    end

    it "should be invalid without a title" do
      bad_site = Site.new(
          title: nil,
          notes: "I liked the tv that was in my room",
          address: "1234 ABC Rd",
          ratings: 4,
          is_visited: true,
          trip: @trip
      )
      expect(bad_site).to_not be_valid
    end
    it "should be invalid without is_visited set" do
      bad_site = Site.new(
          title: "Days Inn",
          notes: "I liked the tv that was in my room",
          address: "1234 ABC Rd",
          ratings: 4,
          is_visited: nil,
          trip: @trip
      )
      expect(bad_site).to_not be_valid
    end
    it "should be invalid without a trip" do
      bad_site = Site.new(
          title: "Days Inn",
          notes: "I liked the tv that was in my room",
          address: "1234 ABC Rd",
          ratings: 4,
          is_visited: true,
          trip: nil
      )
      expect(bad_site).to_not be_valid
    end
  end

  describe "Associations" do
    it "should belong to a trip" do
      assoc = Hotel.reflect_on_association(:trip)
      expect(assoc.macro).to eq :belongs_to
    end
  end
end
