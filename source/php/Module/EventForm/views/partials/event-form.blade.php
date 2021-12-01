<form name="submit-event" class="submit-event" enctype="multipart/form-data">
    @foreach($fields as $field)
        <div>
            <span>
                {{$field->label}}
            </span>
        </div>
    @endforeach
</form>