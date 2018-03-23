require 'rails_helper'

RSpec.describe User, type: :model do
  describe "Validations" do
    it "is valid with valid attributes" do
      user = User.new(name: "Erick", email: "e@test.com", username: "e", password: "long_enough")
      expect(user).to be_valid
    end

    it "is invalid without a name" do
      bad_user = User.new(name: nil, email: "e@test.com", username: "e", password: "long_enough")
      expect(bad_user).to_not be_valid
    end

    it "is invalid without an email" do
      bad_user = User.new(name: "Erick", email: nil, username: "e", password: "long_enough")
      expect(bad_user).to_not be_valid
    end

    it "is invalid without a username" do
      bad_user = User.new(name: "Erick", email: "e@test.com", username: nil, password: "long_enough")
      expect(bad_user).to_not be_valid
    end

    it "is invalid without a password" do
      bad_user = User.new(name: "Erick", email: "e@test.com", username: "e", password: nil)
      expect(bad_user).to_not be_valid
    end

    it "is invalid without a short password" do
      bad_user = User.new(name: "Erick", email: "e@test.com", username: "e", password: "12345")
      expect(bad_user).to_not be_valid
    end

    it "is invalid without a long password" do
      bad_user = User.new(name: "Erick", email: "e@test.com", username: "e", password: "123456789012345678901")
      expect(bad_user).to_not be_valid
    end
  end

  describe "Associations" do
    it "should have many trips" do
      assoc = User.reflect_on_association(:trips)
      expect(assoc.macro).to eq :has_many
    end
    it "should have a trip_public" do
      assoc = User.reflect_on_association(:trip_publics)
      expect(assoc.macro).to eq :has_many
    end
  end
end
