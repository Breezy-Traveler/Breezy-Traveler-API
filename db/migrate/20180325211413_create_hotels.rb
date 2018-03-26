class CreateHotels < ActiveRecord::Migration[5.1]
  def change
    create_table :hotels do |t|
      t.string :title
      t.boolean :is_visited, { null: false, default: false }
      t.string :address
      t.string :notes
      t.integer :ratings
      t.references :trip, foreign_key: true
      t.references :user, foreign_key: true
    end
  end
end
