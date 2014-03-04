# encoding: utf-8
class HomeController < ApplicationController

  def index
    if params[:lat1]
      @photos_all = Photo.joins(:location).select("image, latitude, longitude").where(locations: {latitude: params[:lat2]..params[:lat1], longitude: params[:lon1]..params[:lon2]}, approved: true).sample(3)
      @photos_image = @photos_all.map { |p| { image: p.image_url(:small), latitude: p.latitude, longitude: p.longitude } }
      respond_to do |format|
        format.json { render json: @photos_image }
      end
    end
    @location = Location.new
    @location.photos.build
  end

  def history
    lat = params[:lat].to_f
    lon = params[:lon].to_f
    radius = params[:radius].to_f
    if Location.where(latitude: lat, longitude: lon).first.present?
      lat -=0.0000001
    end
    location = Location.create(name: 'radius', latitude: lat, longitude: lon)
    @locations = location.nearbys(radius)
    location.destroy
    @photos = []
    @locations.each { |l| l.photos.each { |f| @photos << f if f.approved == true } if l.photos.present? }
  end

  def showphoto
    if params[:id]
      photo = Photo.find(params[:id])
      respond_to do |format|
        format.json { render json:
                                  { photo: {
                                        image: photo.image_url(:large),
                                        photo_date: photo.photo_date.strftime("%d.%m.%Y")
                                            },
                                    location_name: photo.location.name,
                                    autor_photo: {
                                        id: photo.user.id,
                                        nick: photo.user.nick,
                                        first_name: photo.user.first_name,
                                        last_name: photo.user.last_name
                                     }
                                  }
                    }
      end
    end
  end

  def markers
    if params[:lat1] && params[:lat2] && params[:lon1] && params[:lon2]
      locations_all = Location.where(latitude: params[:lat2]..params[:lat1], longitude: params[:lon2]..params[:lon1])
      locations = locations_all.map { |l| { location_id: l.id, latitude: l.latitude, longitude: l.longitude, count_photo: l.photos.approved_photo.count } unless (l.photos.approved_photo.count == 0) }
      respond_to do |format|
        format.json { render json: locations.compact }
      end
    end
  end

  def about_us

  end

end