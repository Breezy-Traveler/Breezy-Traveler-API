require 'rails_helper'

RSpec.describe "UserControllers", type: :request do
  describe "GET /user" do
    context "unauthorized" do
      before {
        get "/users"
      }

      it "fails when there is no authentication" do
        expect(response).to_not be_success
      end
    end
  end
end
