class CreateHotels < ActiveRecord::Migration[5.1]
  def change
    create_table :hotels do |t|
      t.string :title
      t.string :address
      t.integer :ratings
      t.string :notes
      t.boolean :is_visisted

      t.timestamps
    end
  end
end
