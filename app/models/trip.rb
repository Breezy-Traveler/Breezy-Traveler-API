class Trip < ApplicationRecord
  validates_presence_of :place, :is_public

  has_many :hotels
  belongs_to :user
end
