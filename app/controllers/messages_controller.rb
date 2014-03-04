# encoding: utf-8
class MessagesController < ApplicationController
  before_action :auth_user

  def show
    @messages = Message.where("(sender_id = #{params[:id]} AND recepient_id = #{current_user.id}) OR (recepient_id = #{params[:id]} AND sender_id = #{current_user.id})").order(:created_at)
    @messages.where(read: false).each { |m| m.update_column(:read, true) if m.recepient == current_user }
    @senser = User.find(params[:id])
  end

  def recepient
    if params[:recepient]
      @message = Message.new(recepient_id: params[:recepient])
    end
  end

  def create
    message = Message.new(message_params)
    message.sender = current_user
    message.message_text = message_params[:message_text].truncate(230, separator: ' ', omission: '...')
    if message.save
      redirect_to root_path, notice: I18n.t('controllers.messages.create_message')
    else
      redirect_to root_path, alert: I18n.t('controllers.messages.not_create_message')
    end
  end

  def destroy
    message = Message.find(params[:id])
    if current_user == message.sender
      message.destroy
      redirect_to user_path(current_user), notice: I18n.t('controllers.messages.destroy_message')
    else
      redirect_to root_path, notice: I18n.t('controllers.messages.not_destroy_message')
    end
  end

  private

  def message_params
    params.require(:message).permit(:recepient_id, :message_text)
  end

end
