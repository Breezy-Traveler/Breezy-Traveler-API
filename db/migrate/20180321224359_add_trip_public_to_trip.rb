class AddTripPublicToTrip < ActiveRecord::Migration[5.1]
  def change
    add_reference :trips, :trip_public, foreign_key: true
  end
end
