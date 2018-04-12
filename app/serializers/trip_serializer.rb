class TripSerializer < ActiveModel::Serializer
  attributes :id, :place, :cover_image_url, :start_date, :end_date, :hotels, :sites, :is_public
end
