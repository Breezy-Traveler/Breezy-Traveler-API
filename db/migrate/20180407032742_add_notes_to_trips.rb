class AddNotesToTrips < ActiveRecord::Migration[5.1]
  def change
    add_column :trips, :notes, :string
  end
end
