class TripSerializer < ActiveModel::Serializer
  attributes :id, :place, :start_date, :end_date, :hotels, :sites, :is_public
end
