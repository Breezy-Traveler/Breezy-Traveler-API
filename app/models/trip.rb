class Trip < ApplicationRecord
  validates :place, presence: true

  belongs_to :user
  has_one :trip_public
end
