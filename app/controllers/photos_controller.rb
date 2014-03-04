# encoding: utf-8
class PhotosController < ApplicationController

  def destroy
    photo = Photo.find(params[:id])
    if current_user == photo.user
      photo.destroy
      redirect_to user_path(current_user), notice: I18n.t('controllers.photos.destroy_photo')
    else
      redirect_to root_path, notice: I18n.t('controllers.photos.not_destroy_photo')
    end
  end

  def photos_author
    if params[:id]
      user = User.find(params[:id])
      respond_to do |format|
        format.json { render json: user.photos.where(approved: true).map { |photo|
                            { photo: {  id: photo.id,
                                        image: photo.image_url(:small),
                                        photo_date: photo.photo_date.strftime("%d.%m.%Y"),
                                        location_name: photo.location.name
                                      }
                            }
                          }
                    }
      end
    end
  end

end