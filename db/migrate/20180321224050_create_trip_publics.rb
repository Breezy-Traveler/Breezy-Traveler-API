class CreateTripPublics < ActiveRecord::Migration[5.1]
  def change
    create_table :trip_publics do |t|
      t.string :place
      t.date :start_date
      t.date :end_date
      t.references :user, foreign_key: true
      t.references :trip, foreign_key: true

      t.timestamps
    end
  end
end
