class Trip < ApplicationRecord
  validates :place, :is_public, presence: true

  belongs_to :user
end
