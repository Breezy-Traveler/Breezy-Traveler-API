class TripPublic < ApplicationRecord
  validates :place, presence: true
  validates :trip, presence: true

  belongs_to :user
  belongs_to :trip
end
