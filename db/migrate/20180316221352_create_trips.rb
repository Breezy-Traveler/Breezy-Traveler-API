class CreateTrips < ActiveRecord::Migration[5.1]
  def change
    create_table :trips do |t|
      t.string :place
      t.date :start_date
      t.date :end_date
      t.boolean :is_public

      t.timestamps
    end
  end
end
