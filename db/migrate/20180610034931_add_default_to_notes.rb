class AddDefaultToNotes < ActiveRecord::Migration[5.1]
  def change
    change_column :trips, :notes, :string, default: ""
    change_column :trips, :notes, :string, null: false
  end
end
