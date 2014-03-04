class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.float :latitude
      t.float :longitude
      t.boolean :approved
      t.datetime :approved_date
      t.datetime :photo_date
      t.integer :user_id
      t.integer :shared_count

      t.timestamps
    end
  end
end
