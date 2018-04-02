require 'http'
class GettyImagesController < ApplicationController
  def index
    term = params[:search_term]

    if term
      response = HTTP["Api-Key" => ENV["GITTY-APP-KEY"]]
                     .get("https://api.gettyimages.com/v3/search/images",
                          :params => {
                              :fields => "thumb",
                              :phrase => term
                          })

      render json: response.body
    end
  end
end

