class AddTypeColumnToHotel < ActiveRecord::Migration[5.1]
=begin
  Be aware that because the type column is an attribute on the record, every new subclass will instantly be marked as
  dirty and the type column will be included in the list of changed attributes on the record.
  http://api.rubyonrails.org/classes/ActiveRecord/Inheritance.html
=end
  def change
    add_column :hotels, :type, :string
  end
end
