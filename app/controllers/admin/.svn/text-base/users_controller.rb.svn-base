# encoding: utf-8
class Admin::UsersController < ApplicationController
  before_filter :admin_user

  def index
    if params[:sort]
      column = params[:sort].split('_').size == 2 ? params[:sort].split('_').first : params[:sort].split('_')[0,2].join('_')
      order = params[:sort].split('_').last.upcase
      @users = User.order("#{column} #{order}")
    elsif params[:photo]
      @users = User.all.sort { |x,y| x.photos.count <=> y.photos.count } if params[:photo] == 'desc'
      @users = User.all.sort { |x,y| y.photos.count <=> x.photos.count } if params[:photo] == 'asc'
    elsif params[:claim]
      @users = User.all.sort { |x,y| x.claims.count <=> y.claims.count } if params[:claim] == 'desc'
      @users = User.all.sort { |x,y| y.claims.count <=> x.claims.count } if params[:claim] == 'asc'
    elsif params[:search]
      @users = User.all.search(params[:search])
    else
      @users = User.all
    end
  end

  def destroy_block
    users_id = params.select {|key, value| key.include?('user_id_') }
    if params[:users] == 'all'
      users = User.all
    elsif users_id.present?
      users = []
      users_id.each { |user| users << User.find(user[1]) if User.find(user[1]).present? }
    else
      redirect_to admin_users_path, alert: I18n.t('controllers.admin_users.chooses_user')
    end
    if params[:block_delete] == 'block'
      users.each { |u| u.update_column(:upload_photo, false) }
      redirect_to admin_users_path, alert: I18n.t('controllers.admin_users.not_upload_photo')
    elsif params[:block_delete] == 'unblock'
      users.each { |u| u.update_column(:upload_photo, true) }
      redirect_to admin_users_path, notice: I18n.t('controllers.admin_users.upload_photo')
    elsif params[:block_delete] == 'delete'
      users.each { |u| u.destroy unless (u == current_user || u.is_superadmin?) }
      redirect_to admin_users_path, notice: I18n.t('controllers.admin_users.destroy_users')
    elsif params[:add_admin] == 'true' && current_user.is_superadmin?
      users.each { |u| u.update_column(:role, 'admin') }
      redirect_to admin_users_path, notice: I18n.t('controllers.admin_users.role_admin')
    elsif params[:add_admin] == 'false' && current_user.is_superadmin?
      users.each { |u| u.update_column(:role, 'user') }
      redirect_to admin_users_path, notice: I18n.t('controllers.admin_users.not_role_admin')
    else
      redirect_to admin_users_path, alert: I18n.t('controllers.admin_users.select_action')
    end
  end

end