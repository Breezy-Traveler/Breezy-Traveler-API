class Trip < ApplicationRecord
  validates_presence_of :place

  # empty string is valid, nil is not valid
  validates :notes, exclusion: { in: [nil] }

  validates_inclusion_of :is_public, :in => [true, false]

  has_many :hotels, -> { where type: nil }
  has_many :sites, -> { where type: "Site" }
  belongs_to :user
end
