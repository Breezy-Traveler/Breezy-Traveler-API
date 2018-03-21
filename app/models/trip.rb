class Trip < ApplicationRecord
  belongs_to :user
  validates :place, presence: true
end
