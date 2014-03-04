# encoding: utf-8
# == Schema Information
#
# Table name: users
#
#  id                      :integer          not null, primary key
#  email                   :string(255)      default: "",   null: false
#  encrypted_password      :string(255)      default: "",   null: false
#  reset_password_token    :string(255)
#  reset_password_sent_at  :datetime
#  remember_created_at     :datetime
#  sign_in_count           :integer          default: 0,    null: false
#  current_sign_in_at      :datetime
#  last_sign_in_at         :datetime
#  current_sign_in_ip      :string(255)
#  last_sign_in_ip         :string(255)
#  nick                    :string(255)
#  first_name              :string(255)
#  last_name               :string(255)
#  birth_date              :datetime
#  gender                  :string(255)
#  role                    :string(255)
#  created_at              :datetime
#  updated_at              :datetime
#  provider                :string(255)
#  uid                     :string(255)
#  confirmation_token      :string(255)
#  confirmed_at            :datetime
#  confirmation_sent_at    :datetime
#  unconfirmed_email       :string(255)
#  upload_photo            :boolean          default: true
#  avatar                  :string(255)
#


class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :confirmable

  mount_uploader :avatar, AvatarUploader

  has_many :claims
  has_many :photos

  has_many :recepient_message, foreign_key: 'recepient_id', class_name: 'Message'
  has_many :sender_message, foreign_key: 'sender_id', class_name: 'Message'

  validates_presence_of :email
  validates_uniqueness_of :email
  validates :nick, length: { maximum: 63 }
  validates_format_of :nick, with: /[\w]/, message: "only letters and numbers", :allow_blank => true
  validates :first_name, length: { maximum: 63 }
  validates_format_of :first_name, with: /\A[а-яА-ЯёЁіІїЇєЄa-zA-Z]+\z/, message: "only allows letters", :allow_blank => true
  validates :last_name, length: { maximum: 63 }
  validates_format_of :last_name, with: /\A[а-яА-ЯёЁіІїЇєЄa-zA-Z]+\z/, message: "only allows letters", :allow_blank => true

  #TODO validates_format_of :birth_date, :with => /\A(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[1-2]\d|3[01])\/\d{4}\Z/, :message => "Date must be in the following format"
  validates_inclusion_of :birth_date, :in => Time.now.years_ago(120).to_date..Time.now.years_ago(5).to_date,
                                      :message => :age, :allow_blank => true

  before_save { |user| user.email = email.downcase }
  before_create :initialize_user

  GENDER = %w(male female)
  ROLES = %w(superadmin admin user manager)

  scope :search, lambda {|q|
    where('nick ILIKE ? or first_name ILIKE ? or last_name ILIKE ? or email ILIKE ?', "%#{q}%", "%#{q}%", "%#{q}%", "%#{q}%")
  }

  def initialize_user
    self.role = 'user' unless role == 'admin'
  end

  def email_required?
    false
  end

  def self.from_omniauth(auth)
    where(auth.slice(:provider, :uid)).first || create_from_omniauth(auth)
  end

  def self.create_from_omniauth(auth)
    user = User.find_by_email(auth.info.email)
    if user
      user.update_attributes(provider: auth.provider, uid: auth.uid)
      where(auth.slice(:provider, :uid)).first
    else
      where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
        user.provider = auth.provider
        user.uid = auth.uid
        user.nick = auth.info.nickname
        user.first_name = auth.info.first_name
        user.last_name = auth.info.last_name
        user.gender = auth.extra.raw_info.gender
        user.birth_date = auth.extra.raw_info.bdate if auth.provider == "vkontakte"
        user.email = auth.info.email
        #TODO: vkontakte fix needed
        user.email = auth.info.email || "vk_mail_#{auth['uid']}@moe.misto"
        user.password = 'secret'+rand(99999).to_s
        user.save!
      end
    end
  end

  def password_required?
    super && provider.blank?
  end

  def update_with_password(params, *options)
    if encrypted_password.blank?
      update_attributes(params, *options)
    else
      super
    end
  end

  def is_admin?
    role == 'admin'
  end

  def is_superadmin?
    role == 'superadmin'
  end
end
