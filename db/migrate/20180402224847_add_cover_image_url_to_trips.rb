class AddCoverImageUrlToTrips < ActiveRecord::Migration[5.1]
  def change
    add_column :trips, :cover_image_url, :string
  end
end
