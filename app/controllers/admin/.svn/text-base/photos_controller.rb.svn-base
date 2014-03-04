# encoding: utf-8
class Admin::PhotosController < ApplicationController
  before_filter :admin_user
  before_filter :find_photo, only: [:edit, :update]

  def index
    if params[:id].present? & params[:approved] == true
      photo = Photo.find(params[:id])
      photo.approved = true
      photo.save
    end
    if params[:date]
      # @photos = Photo.order("photo_date #{params[:date].upcase}")
      @photos = Photo.all.group_by { |p| p.photo_date.beginning_of_month }
    elsif params[:autor]
      # @photos = Photo.order("user_id #{params[:autor].upcase}")
      @photos = Photo.all.group_by { |p| p.user }
    elsif params[:status]
      # @photos = Photo.order("approved #{params[:status].upcase}")
      @photos = Photo.all.group_by { |p| p.approved.to_s }
    elsif params[:last_mounth]
      @photos = Photo.where(created_at: 1.month.ago..Time.now).order(:created_at)
    elsif params[:last_week]
      @photos = Photo.where(created_at: 1.week.ago..Time.now).order(:created_at)
    elsif params[:last_day]
      @photos = Photo.where(created_at: 1.day.ago..Time.now).order(:created_at)
    else
      @photos = Photo.all
    end
    @photos = @photos.paginate(page: params[:page], per_page: 20) unless params[:date] || params[:autor] || params[:status]
  end

  def update
    location = Location.where(latitude: params[:latitude], longitude: params[:longitude]).first
    unless location.present?
      location = Location.create(latitude: params[:latitude], longitude: params[:longitude])
    end
    @photo.location = location
    @photo.photo_date = params[:photo_date]
    if @photo.save
      redirect_to admin_photos_path, notice: I18n.t('controllers.admin_photos.update_photo')
    else
      render action: 'edit'
    end
  end

  def approved_destroy
    photos_id = params.select {|key, value| key.include?('photo_id_') }
    if params[:photos] == 'all'
      if params[:last_mounth]
        photos = Photo.where(created_at: 1.month.ago..Time.now)
      elsif params[:last_week]
        photos = Photo.where(created_at: 1.week.ago..Time.now)
      elsif params[:last_day]
        photos = Photo.where(created_at: 1.day.ago..Time.now)
      else
        photos = Photo.all
      end
    elsif photos_id.present?
      photos = []
      photos_id.each { |photo| photos << Photo.find(photo[1]) if Photo.find(photo[1]).present? }
    else
      redirect_to admin_photos_path, alert: I18n.t('controllers.admin_photos.chooses_photo')
    end
    if params[:approved_delete] == 'approved'
      photos.each { |p| p.update_column(:approved, true) }
      redirect_to admin_photos_path, notice: I18n.t('controllers.admin_photos.approved_photo')
    elsif params[:approved_delete] == 'delete'
      photos.each { |p| p.destroy }
      redirect_to admin_photos_path, notice: I18n.t('controllers.admin_photos.destroy_photo')
    else
      redirect_to admin_photos_path, alert: I18n.t('controllers.admin_photos.select_action')
    end
  end

  private

  def find_photo
    @photo = Photo.find_by_id(params[:id])
  end

end
