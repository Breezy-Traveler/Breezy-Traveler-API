require 'rails_helper'

RSpec.describe "RegisterAndLogins", type: :request do
  describe "POST /register" do

    it "creates and sends success when sending valid params" do
      valid_params = {name: "Erick", username: "es7", email: "e@g.com", password: "long_enough"}
      post "/register", params: valid_params

      expect(response).to be_success
    end

    it "returns missing params when registering" do
      invalid_params = {name: "Erick", username: nil, email: "e@g.com", password: "long_enough"}
      post "/register", params: invalid_params

      expect(response).to_not be_success
    end
  end
end
