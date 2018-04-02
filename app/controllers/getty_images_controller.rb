require 'http'
require 'json'

class GettyImagesSerializer < ActiveModel::Serializer
  attributes :images

  def images
    JSON.parse(object.body.to_s)["images"].map do |an_image|
      an_image["display_sizes"][0]["uri"]
    end
  end
end


class GettyImagesController < ApplicationController
  def index
    term = params[:search_term]

    if term
      response = HTTP["Api-Key" => ENV["GETTY-APP-KEY"]]
                     .get("https://api.gettyimages.com/v3/search/images",
                          :params => {
                              :fields => "thumb",
                              :phrase => term
                          })

      render json: response, serializer: GettyImagesSerializer, root: "images"
    end
  end
end

