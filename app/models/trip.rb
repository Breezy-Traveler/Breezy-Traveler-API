class Trip < ApplicationRecord
  validates_presence_of :place
  validates_presence_of :cover_image_url

  validates_inclusion_of :is_public, :in => [true, false]

  has_many :hotels, -> { where type: nil }
  has_many :sites, -> { where type: "Site" }
  belongs_to :user
end
