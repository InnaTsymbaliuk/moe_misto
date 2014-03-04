# encoding: utf-8
# == Schema Information
#
# Table name: locations
#
#  id           :integer      not null, primary key
#  name        :string(255)
#  address     :string(255)
#  latitude    :float
#  longitude   :float
#  created_at  :datetime
#  updated_at  :datetime
#

class Location < ActiveRecord::Base
  has_many :photos

  accepts_nested_attributes_for :photos

  reverse_geocoded_by :latitude, :longitude  do |obj,results|
  if geo = results.first
      obj.address = geo.address.split(", ").slice(0, 2).join(", ")
    end
  end
  after_validation :reverse_geocode  # auto-fetch address

end
