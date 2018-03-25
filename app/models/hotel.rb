class Hotel < ApplicationRecord
  validates_presence_of :title

  # use inclusion of [true, false] because validates of a bool is only valid if the value is only true. false and
  # nil are identical in Ruby's check for validation https://stackoverflow.com/a/5219435/1967709
  validates_inclusion_of :is_visited, :in => [true, false]

  belongs_to :trip
  belongs_to :user
end
