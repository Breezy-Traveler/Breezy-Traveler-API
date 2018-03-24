class AddPasswordAndTokenToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :token, :string
    add_index :users, :token
    add_column :users, :password_hash, :string
    add_column :users, :password_salt, :string
  end
end
