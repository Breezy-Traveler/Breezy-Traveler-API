class RemoveColumnIsPublicFromTrips < ActiveRecord::Migration[5.1]
  def change
    remove_column :trips, :is_public, :boolean
  end
end
