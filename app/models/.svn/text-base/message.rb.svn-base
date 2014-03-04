# encoding: utf-8
# == Schema Information
#
# Table name: messages
#
#  id            :integer      not null, primary key
#  recepient_id  :integer
#  sender_id     :integer
#  message_text  :string(255)
#  read          :boolean
#  created_at    :datetime
#  updated_at    :datetime

class Message < ActiveRecord::Base
  belongs_to :recepient, class_name: 'User'
  belongs_to :sender, class_name: 'User'

  validates_presence_of :recepient_id, :sender_id, :message_text
end
