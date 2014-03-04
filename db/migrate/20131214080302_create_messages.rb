class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.integer :recepient_id
      t.integer :sender_id
      t.string :message_text
      t.boolean :read

      t.timestamps
    end
  end
end
