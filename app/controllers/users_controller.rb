# encoding: utf-8
class UsersController < ApplicationController
  before_action :find_user, only: [:show, :update]

  def show
    if current_user == @user
      @photos_timeline = @user.photos.approved_photo
      @photos_uploaded = @user.photos.not_approved_photo if params[:uploaded] == 'true'
      if params[:messages] == 'true'
        # @messages_inbox = @user.recepient_message.order('created_at DESC')
        # @messages_outbox = @user.sender_message.order('created_at DESC')
        @messages_users = Message.where(recepient_id: current_user.id).group_by { |m| m.sender }
      end
    else
      redirect_to root_path, notice: I18n.t('controllers.users.not_show_profile')
    end
  end

  def update
    if current_user == @user
      if @user.update(user_params)
        redirect_to user_path(@user), notice: I18n.t('controllers.users.update_profile')
      else
        redirect_to @user, alert: I18n.t('controllers.users.not_update_profile')
      end
    else
      redirect_to root_path, notice: I18n.t('controllers.users.not_show_profile')
    end
  end

  def top_authors
    active_users = User.all.select { |u| u.photos.approved_photo.present? }
    @active_authors = active_users.sort { |x,y| y.photos.count <=> x.photos.count }.last(7)
    @last_authors = Photo.approved_photo.order(:created_at).map { |p| p.user }.reverse.uniq[0..6]
    @shared_authors = Photo.approved_photo.where("shared_count IS NOT NULL").order(:shared_count).map { |p| p.user }.reverse.uniq[0..6]
  end

  def update_password

  end

  private

  def user_params
    params.require(:user).permit(:nick, :first_name, :last_name, :birth_date, :gender, :email, :avatar, :remove_avatar)
  end

  def find_user
    @user = User.find(params[:id])
  end

end
