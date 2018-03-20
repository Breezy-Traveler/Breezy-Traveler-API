class Trip < ApplicationRecord
  belongs_to :user
  validates :place, :is_public, presence: true
end
