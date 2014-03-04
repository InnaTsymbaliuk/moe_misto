# encoding: utf-8
class LocationsController < ApplicationController
  before_filter :auth_user
  before_filter :block_upload, only: :create

  def create
    location = Location.where(latitude: location_params[:latitude], longitude: location_params[:longitude])
    if location.present?
      @photos = []
      location_params['photos_attributes'].keys.each do |k|
        photo = Photo.new
        photo.location = location.first
        photo.user = current_user
        photo.image = location_params['photos_attributes'][k]['image']
        photo.photo_date = location_params['photos_attributes'][k]['photo_date']
        if photo.save
          @photos << photo
        end
      end
      if @photos.count == location_params['photos_attributes'].keys.size
        redirect_to root_path, notice: I18n.t('controllers.locations.create_photo', photo_count: @photos.count)
      else
        redirect_to root_path, alert: I18n.t('controllers.locations.not_create_photo')
      end
    else
      location = Location.create(location_params)
      if location
        location.photos.each do |photo|
          photo.user = current_user
          photo.save
        end
        redirect_to root_path, notice: I18n.t('controllers.locations.create_photo', photo_count: location.photos.count)
      else
        redirect_to root_path, alert: I18n.t('controllers.locations.not_create_photo')
      end
    end
  end

  private

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude, photos_attributes: [:image, :photo_date])
  end
end
