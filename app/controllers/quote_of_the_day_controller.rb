require "http"

class QuoteOfTheDayController < ApplicationController
  def index

    response = HTTP.get('http://quotes.rest/qod')

    render json: response
  end
end
