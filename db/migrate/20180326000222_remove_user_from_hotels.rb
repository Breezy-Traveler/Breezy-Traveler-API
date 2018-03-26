class RemoveUserFromHotels < ActiveRecord::Migration[5.1]
  def change
    remove_reference :hotels, :user, foreign_key: true
  end
end
