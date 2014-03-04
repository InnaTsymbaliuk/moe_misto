# encoding: utf-8
# == Schema Information
#
# Table name: claims
#
#  id          :integer      not null, primary key
#  user_id     :integer
#  photo_id    :integer
#  claim_type  :integer
#  created_at  :datetime
#  updated_at  :datetime
#

class Claim < ActiveRecord::Base
  belongs_to :photo
  belongs_to :user
end
