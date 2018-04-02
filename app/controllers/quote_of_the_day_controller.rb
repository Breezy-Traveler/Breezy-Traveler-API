require "http"

require 'json'
class QuoteOfDaySerializer < ActiveModel::Serializer
  attributes :quote

  def quote
    JSON.parse(object.body.to_s)["contents"]["quotes"][0]
  end
end


class QuoteOfTheDayController < ApplicationController
  def index

    response = HTTP.get('http://quotes.rest/qod')

    render json: response, serializer: QuoteOfDaySerializer
  end
end
