# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180607180055) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "hotels", force: :cascade do |t|
    t.string "title"
    t.boolean "is_visited", default: false, null: false
    t.string "address"
    t.string "notes"
    t.integer "ratings"
    t.bigint "trip_id"
    t.string "type"
    t.index ["trip_id"], name: "index_hotels_on_trip_id"
  end

  create_table "trips", force: :cascade do |t|
    t.string "place"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.boolean "is_public"
    t.string "cover_image_url"
    t.string "notes"
    t.string "start_date"
    t.string "end_date"
    t.index ["user_id"], name: "index_trips_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "username"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "token"
    t.string "password_hash"
    t.string "password_salt"
    t.string "image_data_file_name"
    t.string "image_data_content_type"
    t.integer "image_data_file_size"
    t.datetime "image_data_updated_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["token"], name: "index_users_on_token"
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "hotels", "trips"
  add_foreign_key "trips", "users"
end
